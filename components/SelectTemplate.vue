<template>
  <v-autocomplete
    dense
    chips
    outlined
    clearable
    cache-items
    hide-details
    deletable-chips
    label="邮件模板名称"
    :loading="loading"
    :rules="rules"
    :value="template"
    :items="templates"
    @change="$emit('input', $event)"
  >
    <template #item="{ item }">
      <template>
        <v-list-item-content>
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-list-item-title v-on="on" v-bind="attrs">
                {{ item.text }}
              </v-list-item-title>
            </template>
            <span v-html="item.html"></span>
          </v-tooltip>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'select-template',
  props: ['template', 'rules'],
  model: {
    prop: 'template'
  },
  data: () => ({
    loading: false,
    templates: [
      {
        text: 'Newsletter',
        value: 'Newsletter',
        html: `<h2>
    Monthly Newsletter
</h2>
<p>
    Dear valued customer,
</p>
<p>
    We&#39;re excited to share with you the latest news and updates from our company. Here are some of the highlights:
</p>
<ul>
    <li>
        New products
    </li>
    <li>
        Special promotions and discounts
    </li>
    <li>
        Company events and milestones
    </li>
    <li>
        Industry news and insights
    </li>
</ul>
<p>
    Stay in the know and be the first to know about our latest offerings. Sign up for our newsletter today!
</p>
<p>
    <a href="http://#">Sign up now</a>
</p>
<p>
    Thank you for your continued support and loyalty. We appreciate your business and look forward to serving you.
</p>
<p>
    Best regards,
</p>
<p>
    The Marketing Team
</p>`
      },
      {
        text: 'Product',
        value: 'Product',
        html: `<p>

</p>
<h2>
    Introducing our latest product!
</h2>
<p>


</p>
<p>
    Dear valued customer,
</p>
<p>


</p>
<p>
    We&#39;re excited to announce the launch of our newest product, Product X. This innovative product is designed to help you achieve your goals faster and more efficiently.
</p>
<p>


</p>
<p>
    Here are some of the key features and benefits:
</p>
<p>


</p>
<ul>
    <li>


    </li>
    <li>
        Feature 1
    </li>
    <li>


    </li>
    <li>
        Feature 2
    </li>
    <li>


    </li>
    <li>
        Feature 3
    </li>
    <li>


    </li>
    <li>
        Benefit 1
    </li>
    <li>


    </li>
    <li>
        Benefit 2
    </li>
    <li>


    </li>
    <li>
        Benefit 3
    </li>
    <li>


    </li>
</ul>
<p>


</p>
<p>
    Order now and be one of the first to experience the power of Product X. Use the promo code LAUNCH10 to receive 10% off your purchase.
</p>
<p>

	<a href="http://#">Order now</a>

</p>
<p>
    Thank you for your business and we look forward to serving you.
</p>
<p>


</p>
<p>
    Best regards,
</p>
<p>


</p>
<p>
    The Marketing Team
</p>`
      },
      {
        text: 'Invitation',
        value: 'Invitation',
        html: `<h2>
    You&#39;re invited to our upcoming event!
</h2>
<p>
    Dear valued customer,
</p>
<p>
    We&#39;re excited to invite you to our upcoming event, where you&#39;ll have the opportunity to learn, network, and have fun with like-minded individuals. Here are some of the event details:
</p>
<ul>
    <li>
        Event name and date
    </li>
    <li>
        Location and time
    </li>
    <li>
        Keynote speakers and panelists
    </li>
    <li>
        Networking opportunities
    </li>
    <li>
        Refreshments and food
    </li>
</ul>
<p>
    Don&#39;t miss out on this opportunity to connect with industry leaders and learn from the best. RSVP now to secure your spot!
</p>
<p>
    <a href="http://#">RSVP now</a>
</p>
<p>
    Thank you for your business and we look forward to seeing you at the event.
</p>
<p>
    Best regards,
</p>
<p>
    The Marketing Team
</p>`
      }
    ]
  })
}
</script>
